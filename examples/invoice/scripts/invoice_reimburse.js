
/**
 * request for reimbursement of invoice(s)
 * @param {oxchains.invoice.Reimbursement} rbTx
 * @transaction
 */
function requestReimbursement(rbTx) {
    var operator = getCurrentParticipant();
    var owner = !!operator.entity ? operator.entity : operator;

    if(rbTx.invoices.some(function(i){return i.owner.getIdentifier() != owner.getIdentifier();})){
        throw new Error("only your own invoices can be reimbursed!");
    }

    if (rbTx.invoices.some(function (i) { return i.reimbursementState == "STAGING"; })) {
        throw new Error("only open invoices can be reimbursed!");
    }


    if(rbTx.invoices.some(function(i){ return i.title.getIdentifier() != rbTx.invoices[0].title.getIdentifier();})){
        throw new Error("only titled company can reimburse this invoice!");
    }

    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function(ar) {
            rbTx.invoices.forEach(function(invoice){ invoice.reimbursementState = "STAGING"; });
            return ar.updateAll(rbTx.invoices);
        });
}

/**
 * accept reimbursement
 * @param {oxchains.invoice.AcceptReimbursement} rbAcceptTx
 * @transaction
 */
function acceptReimbursement(rbAcceptTx) {
    if(rbAcceptTx.invoices.some(function(i){ return i.owner.getIdentifier() != rbAcceptTx.requestBy.getIdentifier(); })){
        throw new Error("only invoices of 'requestBy' can be reimbursed in a batch!");
    }

    var operator = getCurrentParticipant();
    var nextOwner = !!operator.entity ? operator.entity : operator;
    var currentOwner = rbAcceptTx.invoices[0].owner;

    function totalPriceOfInvoice(invoice) {
        return invoice.productListings.map(function (listing) { return listing.price * listing.quantity; })
            .reduce(function (listingAmount1, listingAmount2) { return listingAmount1 + listingAmount2; });
    }

    var total = rbAcceptTx.invoices.map(function(i){ return totalPriceOfInvoice(i); }).reduce(function(t1, t2){return t1+t2;});

    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function(ar){
            rbAcceptTx.invoices.forEach(function(invoice){ 
                invoice.reimbursementState = "CLOSE";
                invoice.owner = nextOwner;
            });
            return ar.updateAll(rbAcceptTx.invoices);
        }).then(function() {
            return getParticipantRegistry("oxchains.invoice.Entity");
        }).then(function(pr) {
            currentOwner.balance += total;
            return pr.update(currentOwner).then(function() {
                if(nextOwner.isRelationship()){
                    return pr.get(nextOwner.getIdentifier()).then(function(nextOwnerRes) {
                        nextOwnerRes.balance -= total;
                        return pr.update(nextOwnerRes);
                    });
                }else{
                    nextOwner.balance -= total;
                    return pr.update(nextOwner);
                }
            });
        }).then(function() {
            var reimbursedEvent = getFactory().newEvent('oxchains.invoice', 'ReimbursementAcceptedEvent');
            reimbursedEvent.owner = currentOwner;
            reimbursedEvent.invoices = rbAcceptTx.invoices.map(function(i) { return i.getIdentifier(); });
            emit(reimbursedEvent);
        });
}

/**
 * reject reimbursement
 * @param {oxchains.invoice.RejectReimbursement} rbRejectTx 
 * @transaction
 */
function rejectReimbursement(rbRejectTx) {
    if(rbRejectTx.invoices.some(function(i){ return i.owner.getIdentifier() != rbRejectTx.requestBy.getIdentifier(); })){
        throw new Error("only invoices of 'requestBy' can be rejected in a batch!");
    }

    var currentOwner = rbRejectTx.invoices[0].owner;

    return getAssetRegistry("oxchains.invoice.Invoice")
        .then(function(ar){
            rbRejectTx.invoices.forEach(function(invoice){ invoice.reimbursementState = "OPEN"; });
            return ar.updateAll(rbRejectTx.invoices);
        }).then(function() {
            var rejectedEvent = getFactory().newEvent('oxchains.invoice', 'ReimbursementRejectedEvent');
            rejectedEvent.owner = currentOwner;
            rejectedEvent.invoices = rbRejectTx.invoices.map(function(i) { return i.getIdentifier(); });
            emit(rejectedEvent);
        });
}
