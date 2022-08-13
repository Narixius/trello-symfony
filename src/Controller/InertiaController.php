<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\HttpFoundation\Request;


class InertiaController extends AbstractController
{
    #[Route('/inertia', name: 'app_inertia')]
    public function index(InertiaInterface $inertia, Request $request): Response
    {
        return $inertia->render('Dashboard', $request->request->all());
    }

    #[Route('/inertia/create', methods: ['POST'])]
    public function create(InertiaInterface $inertia, Request $request): Response
    {
        return $this->redirectToRoute('app_inertia');
    }
}
