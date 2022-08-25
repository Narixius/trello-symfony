<?php

namespace App\EventListener;

use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class AccessDeniedListener implements EventSubscriberInterface
{
    private $inertia;
    public function __construct(InertiaInterface $inertia)
    {
        $this->inertia = $inertia;
    }
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 2],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $status = 404;

        $event->setResponse($this->inertia->render('Error', ['status' => $status])->setStatusCode($status));
        $event->stopPropagation();
    }
}