//Why underscore? Because its isEqual call is the fastest.
import underscore from 'underscore';
import _ from 'lodash';

export default (createTransaction, getEntityRepository) => () => {
    const entityMap = new Map();

    return {
        trackEntity(entity, {isNew = false} = {}) {
            const repository = getEntityRepository(entity);
            const originalDbEntity = _.cloneDeep(repository.toDbEntity(entity));
            entityMap.set(entity, {isNew, originalDbEntity, repository});
        },

        commit() {
            const entries = getDirtyEntries(entityMap);

            if (entries.length > 0) {
                return createTransaction().then(transaction => {
                    return Promise
                        .all(entries.map(entry => entry.repository.save(entry.dbEntity, transaction, entry.originalDbEntity)))
                        .then(() => transaction.commit())
                        .catch(err => {
                            console.error('transaction failed', err);
                            return transaction.rollback();
                        })
                });
            } else {
                return Promise.resolve();
            }
        }
    };
}

function getDirtyEntries(map) {
    const entries = [];

    for (let [entity, {isNew, originalDbEntity, repository}] of map.entries()) {
        const currentDbEntity = repository.toDbEntity(entity);
        const dirty = isNew || isDirty(currentDbEntity, originalDbEntity);

        if (dirty) {
            entries.push({entity, repository, dbEntity: currentDbEntity, originalDbEntity});
        }
    }

    return entries;
}

function isDirty(newObj, oldObj) {
    return !underscore.isEqual(newObj, oldObj);
}
