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