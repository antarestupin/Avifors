import assert from 'assert'
import fs from 'fs'

describe('# main', function() {
  describe('generate', function() {
    it("should generate code from model", () => {
      assert.equal(
        `<?php

namespace Acme\\Event;

class PasswordChanged extends BaseEvent {
    private $name;
    private $userId;
    private $encryptedNewPassword;

    public function __construct($userId, $encryptedNewPassword) {
        $this->name = 'acme-password-changed';
        $this->userId = $userId;
        $this->encryptedNewPassword = $encryptedNewPassword;
    }

    public function getUserId() {
        return $this->userId;
    }
    public function getEncryptedNewPassword() {
        return $this->encryptedNewPassword;
    }
}
`,
        fs.readFileSync('./example/output/Event/PasswordChanged.php', 'utf8')
      )
    })
  })
})
