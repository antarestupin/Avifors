import assert from 'assert'
import fs from 'fs'

describe('# main', function() {
  describe('generate', function() {
    it("should generate code from model", () => {
      assert.equal(
        `<?php

namespace Acme\\Event;

class MyNamespacePasswordChanged extends BaseEvent {
    private $name;
    private $userId;
    private $encryptedNewPassword;

    public function __construct($userId, $encryptedNewPassword) {
        $this->name = 'acme-my-namespace-password-changed';
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
        fs.readFileSync('./test/output/Event/MyNamespacePasswordChanged.php', 'utf8')
      )
    })

    it("should generate from auto generators", () => {
      assert.equal(
        `<?php

namespace Acme;

class Events {
    public $events = [
        'my_namespace_user_registered',
        'my_namespace_password_changed'
    ];
}
`,
        fs.readFileSync('./test/output/Events.php', 'utf8')
      )
    })
  })
})
