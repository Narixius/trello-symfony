<?php

namespace App\Controller;

use App\Entity\Card;
use App\Form\CardType;
use App\Repository\CardRepository;
use App\Repository\CategoryRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/card')]
class CardController extends AbstractController
{
    #[Route('/create', name: 'app_card_new', methods: ['POST'])]
    public function new(Request $request, ErrorGenerator $eg, CardRepository $cardRepository, Security $security, ValidatorInterface $validator, InertiaInterface $inertia): Response
    {
        $card = new Card();
        $form = $this->createForm(CardType::class, $card);
        $form->handleRequest($request);
        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        $errors = $validator->validate($card);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
        }
        else if($form->isValid()) {
            $c = $cardRepository->createQueryBuilder('c')
                ->select('c.orderNumber')
                ->where('c.category = :category_id')
                ->setParameter('category_id', $data['category'])
                ->orderBy('c.createdAt', 'DESC')
                ->getQuery()->execute();
            $card->setOrderNumber(count($c) > 0 ? ++$c[0]['orderNumber']: 1);
            $cardRepository->add($card, true);
        }

        return $this->redirect($request->headers->get('referer'));
    }
}
