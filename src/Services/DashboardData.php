<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class DashboardData {
    private Security $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function getDashboardData(Request $request){
        $user = $this->security->getUser();
        $boards = $user->getBoards();
        $errors = $request->getSession()->get('errors');
        $request->getSession()->remove('errors');
        return [
            'boards' => sizeof($boards) == 0 ? [] : $boards,
            'user'=> $user,
            'errors'=> $errors
        ];
    }
}