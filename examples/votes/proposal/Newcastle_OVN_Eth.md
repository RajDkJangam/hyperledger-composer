# Newcastle University

by _Patrick McCorry, Ehsan Toreini, Maryam Mehrnezhad_

## Stategy

based on Open Voting Network

participants include election authority, voters, ethereum blockchain.

- setup
  1. election authority list eligible voters, the start time and end time

- register
  1. voters register ballots for the election by participating in the first found
  2. network verify ballot and computes output of first round: $$ g^{y_i} $$
  3. voter retrieve the output

- vote
  1. voters participate in the second round
  2. network verify vote and accept it onto the blockchain 
  3. vote tally

## Risk

Open Voting Network is vulnerable to DoS attack if participants are anonymous and lack of coercion resistence in a decentralised environment.
