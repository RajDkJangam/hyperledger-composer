# Edinburg Napier University

by _Peter Aaby, Charley Celice, Sean McKeown_

## Strategy

1. polling card associated with a participant, identifying eligible voters
2. generate ticket to identify vote: `genTicket(name, address, ..., nonce).save()`
3. randomly pick a ticket by presenting polling card
4. vote with the ticket, participant receives a receipt containing ticket ID, a symmetric encryption key and a portion of the encrypted vote (shared secrets distributed among voters, blockchain and optionally government)
5. with keys of any two of voter, blockchain, government combined, the secrets and the results of election can be recovered