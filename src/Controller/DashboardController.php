<?php

namespace App\Controller;

use App\Services\DashboardData;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;


class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(Request $request, InertiaInterface $inertia, DashboardData $dashboardData, Security $security,  TranslatorInterface $translator): Response
    {
        $inertia->share('messages', Yaml::parseFile(__DIR__.'/../../translations/messages.'.$translator->getLocale().".yaml"));
        $inertia->share('locale', $translator->getLocale());
        if(!$security->getUser())
            return $this->redirectToRoute("app_login");
        return $inertia->render('Dashboard', $dashboardData->getDashboardData($request));
    }
}
