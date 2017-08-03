# Drexel University

by _Jeniffer Bondarchuk, Alexis Serra, Colbert Zhu_

a online voting system based on bitcoin-alike system

- registration
  1. use social security number to register for voting via wallet software
  2. government approves registration by generating a bitcoin address that represents one vote
  3. private key is kept with the government

- election day
  1. unique address of candidates for each voter
  2. voter vote for one of the candidates, the vote is sent to the candidate and a txID returned for the voter

- counting and publication
  1. each record of voter.address-candidate.x.address-candidate.y.address-voting.txid is checked
  2. votes counted by number of transactions, not the final amount of bitcoins within the candidates' address
  3. if voter's bitcoin is sent to more than one candidates, the vote will be discounted
  4. the full ledger will be released to public and each voter can verify their votes and the final count
