/**
 * pay product listing
 * @param {oxchains.invoice.PayProductListing} payTx
 * @transaction
 */
function payProductListing(payTx) {
    var operator = getCurrentParticipant();
    var buyer = !!operator.entity ? operator.entity : operator;
    var total = payTx.productListings.map(function(listing){ return listing.price * listing.quantity; })
        .reduce(function(listingAmount1, listingAmount2){return listingAmount1 + listingAmount2;});
    return getParticipantRegistry("oxchains.invoice.Entity")
        .then(function(pr){
            /* assume buyer has enough balance to cover the amount of listings */
            buyer.balance -= total;
            return pr.update(buyer);
        }).then(function(){
            return getParticipantRegistry("oxchains.invoice.Company");
        }).then(function(pr){
            payTx.seller.entity.balance += total;
            return pr.update(payTx.seller);
        }).then(function() {
            return getAssetRegistry("oxchains.invoice.Invoice");
        }).then(function(ar){
            var invoice = getFactory().newResource("oxchains.invoice", "Invoice", "EI-"+Math.floor(Math.random()*7000 + Date.now()));
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

    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function(ar) {
            transferTx.invoices.forEach(function(invoice){ invoice.owner = transferTx.to; });
            return ar.updateAll(transferTx.invoices);
        });
}


/**
 * request for reimbursement of invoice(s)
 * @param {oxchains.invoice.Reimbursement} rbTx
 * @transaction
 */
function requestReimbursement(rbTx) {
    var operator = getCurrentParticipant();
    var owner = !!operator.entity ? operator.entity : operator;

    var sameTitle = rbTx.invoices.length==1 || rbTx.invoices.reduce(function(a, b) {
        if(!a.same) a.same = true;
        return {"title": b.title, "same": a.same && a.title == b.title }; 
    }).same;
    if(!sameTitle) throw new Error("only invoices of the same title can be reimbursed!");
    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function(ar) {
            rbTx.invoices.forEach(function(invoice){ invoice.reimbursementState = "STAGING"; });
            ar.updateAll(rbTx.invoices);
        });
}

/**
 * accept reimbursement
 * @param {oxchains.invoice.AcceptReimbursement} rbAcceptTx
 * @transaction
 */
function acceptReimbursement(rbAcceptTx) {
    return "";
}

/**
 * deny reimbursement
 * @param {oxchains.invoice.DenyReimbursement} rbDenyTx 
 * @transaction
 */
function denyReimbursement(rbDenyTx) {
   return ""; 
}