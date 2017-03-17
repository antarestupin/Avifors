'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('# main', function () {
    describe('generate', function () {
        it("should generate code from model", function () {
            _assert2.default.equal('<?php\n\nnamespace Acme\\Event;\n\nclass PasswordChanged extends BaseEvent {\n    private $name;\n    private $userId;\n    private $encryptedNewPassword;\n\n    public function __construct($userId, $encryptedNewPassword) {\n        $this->name = \'acme-password-changed\';\n        $this->userId = $userId;\n        $this->encryptedNewPassword = $encryptedNewPassword;\n    }\n\n    public function getUserId() {\n        return $this->userId;\n    }\n    public function getEncryptedNewPassword() {\n        return $this->encryptedNewPassword;\n    }\n}\n', _fs2.default.readFileSync('./example/output/Event/PasswordChanged.php', 'utf8'));
        });
    });
});