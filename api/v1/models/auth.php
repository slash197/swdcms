<?php
class Auth
{
	protected $db = null;
	protected $input = null;
	
	function __construct($input)
	{
		global $db;
		
		$this->db = $db;
		$this->input = $input;
	}
	
	public function signIn()
	{
		if ($this->input->has(array('q')))
		{
			// backend members
			if ($this->isLocked()) return array('status' => false, 'error' => '[1007] Access to control panel is locked');
			
			$res = $this->db->run("SELECT * FROM admin_member WHERE username = '{$this->input->username}'");
			
			if (count($res))
			{
				$user = $res[0];
				
				if (($this->input->password === $user['password']) || ($this->decrypt($user['password']) === $this->input->password))
				{
					$this->log('granted');
					return array('status' => true, 'token' => $this->getToken($user));
				}
				
				$this->log('denied');
				return array('status' => false, 'error' => '[1006] Invalid username or password');
			}
			
			$this->log('denied');		
			return array('status' => false, 'error' => '[1005] Invalid username or password');
		}
		else
		{
			// frontend members
		}
	}
	
	protected function getToken($user)
	{
		unset($user['password']);
		return $this->encrypt(implode('|', $user));
	}
	
	protected function log($status)
	{
		$this->db->insert("admin_access", array(
			'username'	=>	$this->input->username,
			'ip'		=>	$_SERVER['REMOTE_ADDR'],
			'date'		=>	time(),
			'status'	=>	$status
		));
	}
	
	protected function isLocked()
	{
		$res = $this->db->run("SELECT date, status FROM admin_access WHERE username = '{$this->input->username}' AND ip = '{$_SERVER['REMOTE_ADDR']}' ORDER BY date DESC LIMIT 3");
		
		foreach ($res as $access)
		{
			if ($access['status'] === 'granted') return false;
		}
		
		if ((time() - $res[0]['date']) > 86400) return false;
	
		return true;
	}
	
	protected function encrypt($plain)
	{
		$c = new Cryptor();
		return $c->Encrypt($plain, 'abc');
	}
	
	protected function decrypt($encrypted)
	{
		$c = new Cryptor();
		return $c->Decrypt($encrypted, 'abc');
	}
}