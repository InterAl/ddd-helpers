'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestContext = require('request-context');

var _requestContext2 = _interopRequireDefault(_requestContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = function () {
    function Repository(getUow) {
        _classCallCheck(this, Repository);

        this.getUow = getUow;
    }

    _createClass(Repository, [{
        key: 'trackEntity',
        value: function trackEntity(entity) {
            this.getUow().trackEntity(entity);
        }
    }]);

    return Repository;
}();

exports.default = Repository;