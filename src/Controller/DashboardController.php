<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\DashboardData;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;


class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(Request $request, InertiaInterface $inertia, DashboardData $dashboardData, Security $security): Response
    {
        if(!$security->getUser())
            return $this->redirectToRoute("app_login");
        return $inertia->render('Dashboard', $dashboardData->getDashboardData($request));
    }

    #[Route('/inertia/create', methods: ['POST'])]
    public function create(InertiaInterface $inertia, Request $request): Response
    {
        return $this->redirectToRoute('app_dashboard');
    }
}
