# Pitfalls

## ACL

condition and param binding:

- does not support binding of "ANY"

```javascript
rule AnyParticipantMatchingRule {
  description: "the precondition matching would always fail"
  participant(m): "ANY"
  operation: ALL
  resource(r): "sample.Resource"
  condition: ( r.owner.getIdentifier() == m.getIdentifier() )
  action: ALLOW
}
```

- cannot use mapping function of arrays in condition, the variables binded does not resolve in precondition matching

```javascript
rule EntityRule {
  description: "the precondition matching would always fail"
  participant: "ANY"
  operation: ALL
  resource(tx): "sample.Transaction"
  condition: (
    tx.attrs.length >= 1
    && tx.attrs.every(function(attr){ return attr.prop == tx.attrs[0].prop;})
  )
  action: ALLOW
}
```

## Transaction Logic

- cannot declare utility function below transaction handler

```javascript
/**
 * transaction handler
 * @param {sample.Transaction} tx 
 * @transaction
 */
function txHandler(tx) {
    //do something
    return "";
}

function utility(param) {
    //param will be evaluated when executing txHandler, param will be a resolved transaction
    return "";
}
```

- cannot update resource via a relationship

```javascript
//model.cto
model Entity identified by id{
  o String id
  o Long balance
}

model Group identified by id{
  o String id
  --> Entity entity
}

//transaction.script
/**
 * balance transfer
 * @param {sample.TransferBalance} tbTx 
 * @transaction
 */
function txHandler(tbTx) {
    tbTx.group.entity.balance += tbTx.amount;
    return getParticipantRegistry("sample.Group")
        .then(function(pr) {
            //this would fail because group.entity is an relationship
            return pr.update(tbTx.group.entity);
        });
}
```

- `composer-cli archive create` does not support cross namespace concept import

the following models cannot be packaged:

```javascript
//model/a.cto
namespace auction.model.public

/* package would be viable if we change 'concept' to 'abstract participant' or 'participant' */
concept User {
  o String name
}

participant Auctioneer identified by aid extends User {
  o String aid
}

//model/b.cto
namespace auction.model.private

participant Member identified by mid extends User {
  o String mid
}
```