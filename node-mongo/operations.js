const Collection = require('mongodb/lib/collection');

const assert = require('assert').strict;

exports.inserDocument = (db, document, Collection, callback) => {
    const coll = db.collection(Collection);
    coll.insertOne(document, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};

exports.findDocument = (db, Collection, callback) => {
    const coll = db.collection(Collection);
    coll.find().toArray((err, docs) => {
        assert.strictEqual(err, null);
        callback(docs);
    });
};

exports.removeDocument = (db, document, Collection, callback) => {
    const coll = db.collection(Collection);
    coll.deleteOne(document, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};

exports.updateDocument = (db, document, update, Collection, callback) => {
    const coll = db.collection(Collection);
    coll.updateOne(document, { $set: update }, null, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};
