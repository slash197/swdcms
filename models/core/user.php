<?php
/*
 * @Author: Slash Web Design
 */

class User extends Core
{
	public $id;
	public $name;
	public $password;
		
	function __construct()
	{
		parent::__construct();
		
		$this->id = (int) $_SESSION['user_id'];
		
		$res = $this->db->run("SELECT * FROM member WHERE member_id = {$this->id}");
		foreach ($res[0] as $key => $value)
		{
			switch ($key)
			{
				case 'password': 
					$this->$key = $this->helper->decrypt($value);
					break;
				
				default:
					$this->$key = $value;
			}
		}

		$this->name = trim($this->fname . " " . $this->lname);
	}
}