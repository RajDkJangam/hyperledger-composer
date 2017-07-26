
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


    if(rbTx.invoices.some(function(i){ return i.title != rbTx.invoices[0].title;})){
        throw new Error("only titled entity can reimburse this invoice!");
    }

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