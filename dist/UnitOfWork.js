'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); //Why underscore? Because its isEqual call is the fastest.


var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (createTransaction, getEntityRepository) {
    return function () {
        var entityMap = new Map();

        return {
            trackEntity: function trackEntity(entity) {
                var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                    _ref$isNew = _ref.isNew,
                    isNew = _ref$isNew === undefined ? false : _ref$isNew;

                var repository = getEntityRepository(entity);
                var originalDbEntity = _lodash2.default.cloneDeep(repository.toDbEntity(entity));
                entityMap.set(entity, { isNew: isNew, originalDbEntity: originalDbEntity, repository: repository });
            },
            commit: function commit() {
                var entries = getDirtyEntries(entityMap);

                if (entries.length > 0) {
                    return createTransaction().then(function (transaction) {
                        return Promise.all(entries.map(function (entry) {
                            return entry.repository.save(entry.dbEntity, transaction, !entry.isNew ? entry.originalDbEntity : undefined);
                        })).then(function () {
                            return transaction.commit();
                        }).catch(function (err) {
                            console.error('transaction failed', err);
                            return transaction.rollback().then(function () {
                                throw err;
                            });
                        });
                    });
                } else {
                    return Promise.resolve();
                }
            }
        };
    };
};

function getDirtyEntries(map) {
    var entries = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                entity = _step$value[0],
                _step$value$ = _step$value[1],
                isNew = _step$value$.isNew,
                originalDbEntity = _step$value$.originalDbEntity,
                repository = _step$value$.repository;

            var currentDbEntity = repository.toDbEntity(entity);
            var dirty = isNew || isDirty(currentDbEntity, originalDbEntity);

            if (dirty) {
                entries.push({ entity: entity, repository: repository, dbEntity: currentDbEntity, originalDbEntity: originalDbEntity, isNew: isNew });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return entries;
}

function isDirty(newObj, oldObj) {
    return !_underscore2.default.isEqual(newObj, oldObj);
}