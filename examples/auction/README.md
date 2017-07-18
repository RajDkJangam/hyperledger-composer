# A Vehicle Auction Network

Inspired by official sample of [car auction network](https://github.com/hyperledger/composer-sample-networks/tree/master/packages/carauction-network), the following models are defined:

- Participants:
  - `Auctioneer`: manages the bidding
  - `Member`: registered members can make offers or post assets for bidding

- Assets:
  - `Vehicle`: owned by a member, and can accept bid offer when in `OPEN` state

- Transactions:
  - `PostBidding`: members can post assets for bidding
  - `RecallBidding`: members can recall bidding before opening
  - `OpenBidding`: auctioneer can open bidding
  - `Offer`: members can make offers to vehicle assets that are in `OPEN` state;
  - `CloseBidding`: auctioneer can close the bidding and transfer the asset to the latest bidder that made the highest offer; the owner can get a balance transfer from the bidder;

- Events:
  - `BidOpenEvent`: when auctioneer opens a bidding, a related event will be emitted
  - `BidCloseEvent`: when auctioneer closes a bidding, a related event will be emitted
