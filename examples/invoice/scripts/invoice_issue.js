/**
 * pay product listing
 * @param {oxchains.invoice.PayProductListing} payTx
 * @transaction
 */
function payProductListing(payTx) {
    var operator = getCurrentParticipant();
    var buyer = !!operator.entity ? operator.entity : operator;
    var total = payTx.productListings.map(function (listing) { return listing.price * listing.quantity; })
        .reduce(function (listingAmount1, listingAmount2) { return listingAmount1 + listingAmount2; });

    if(buyer.balance < total){
        throw new Error("balance insufficient!");
    }

    return getParticipantRegistry("oxchains.invoice.Entity")
        .then(function (pr) {
            /* assume buyer has enough balance to cover the amount of listings */
            buyer.balance -= total;
            return pr.update(buyer).then(function() {
                return pr.get(payTx.seller.entity.getIdentifier())
                    .then(function(sellerEntity) {
                        sellerEntity.balance += total;
                        return pr.update(sellerEntity);
                    });
            }).then(function() {
                return getAssetRegistry("oxchains.invoice.Invoice");
            });
        }).then(function (ar) {
            var invoice = getFactory().newResource("oxchains.invoice", "Invoice", "EI-" + Math.floor(Math.random() * 7000 + Date.now()));
            invoice.title = payTx.invoiceTitle;
            invoice.by = payTx.seller;
            invoice.owner = buyer;
            invoice.productListings = payTx.productListings;
            invoice.reimbursementState = "OPEN";
            return ar.add(invoice);
        });
}

/**
 * transfer invoice from one entity to another
 * @param {oxchains.invoice.InvoiceTransfer} transferTx
 * @transaction
 */
function transferInvoice(transferTx) {
    var operator = getCurrentParticipant();
    var owner = !!operator.entity ? operator.entity : operator;

    if (transferTx.invoices.some(function (i) { return i.reimbursementState == "STAGING"; })) {
        throw new Error("cannot transfer staging invoices!");
    }

    if (transferTx.invoices.some(function (i) { return i.owner.getIdentifier() != owner.getIdentifier(); })) {
        throw new Error("only your own invoices can be transferred!");
    }

    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function (ar) {
            transferTx.invoices.forEach(function (invoice) { invoice.owner = transferTx.to; });
            return ar.updateAll(transferTx.invoices);
        });
}
