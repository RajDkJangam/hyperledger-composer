/**
 * members can make offer to vehicle
 * @param {oxchains.auction.model.public.Offer} offerTx
 * @transaction
 */
function makeOffer(offerTx) {
    offerTx.vehicle.bidder = getCurrentParticipant();
    offerTx.vehicle.offer = offerTx.offer;
    return getAssetRegistry('oxchains.auction.model.public.Vehicle')
        .then(function (vr) {
            return vr.update(offerTx.vehicle);
        });
}

/**
 * auctioneer can close the bidding, the vehicle is transferred to the highest bidder when closing
 * @param {oxchains.auction.model.public.CloseBidding} closeTx
 * @transaction
 */
function closeBidding(closeTx) {
    var finalOffer = closeTx.vehicle.offer;
    return getParticipantRegistry('oxchains.auction.model.public.Member')
        .then(function(mr) {
            closeTx.vehicle.owner.balance += finalOffer;
            return mr.update(closeTx.vehicle.owner);
        }).then(function() {
            return getAssetRegistry('oxchains.auction.model.public.Vehicle');      
        }).then(function (mr){
            closeTx.vehicle.state = "CLOSE";
            closeTx.vehicle.owner = closeTx.vehicle.bidder;
            return mr.update(closeTx.vehicle);
        }).then(function (){
            return getParticipantRegistry('oxchains.auction.model.public.Member');
        }).then(function(pr){
            closeTx.vehicle.bidder.balance -= finalOffer;
            return pr.update(closeTx.vehicle.bidder);
        }).then(function(){
            var bidClosed = getFactory().newEvent('oxchains.auction.model.public', 'BidCloseEvent');
            bidClosed.vehicle = closeTx.vehicle;
            emit(bidClosed);
        });
}
