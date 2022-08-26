<?php

namespace App\Controller;

use App\Entity\Card;
use App\Entity\User;
use App\Form\CardType;
use App\Repository\CardRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/card')]
#[IsGranted("ROLE_USER")]
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
            $this->denyAccessUnlessGranted('BOARD_READ', $card->getCategory()->getBoard());
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

    #[Route('/{id}', name: 'app_card_edit', methods: ['PATCH'])]
    public function edit(int $id, Request $request, ErrorGenerator $eg, CardRepository $cardRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        /** @var Card $card */
        $card = $cardRepository->find($id);
        if(!$card) {
            $request->getSession()->set('errors', ['message' => 'Card not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $this->denyAccessUnlessGranted('BOARD_READ', $card->getCategory()->getBoard());
        $form = $this->createForm(CardType::class, $card);
        $form->handleRequest($request);

        $form->submit([
            'title' => isset($data['title']) ? $data['title'] : $card->getTitle(),
            'description' => isset($data['description']) ? $data['description'] : $card->getDescription(),
            'dueDate' => isset($data['dueDate']) ? $data['dueDate']  : $card->getDueDate(),
            'category' => isset($data['category']) ? $data['category'] : $card->getCategory(),
            'assignees' => isset($data['assignees']) ? $data['assignees'] : $card->getAssignees(),
            'labels' => isset($data['labels']) ? $data['labels'] : $card->getLabels()
        ]);

        $errors = $validator->validate($card);
        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
            return $this->redirect($request->headers->get('referer'));
        }
        $cardRepository->add($card, true);
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}', name: 'app_card_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request, ErrorGenerator $eg, Security $security, Card $card, CardRepository $cardRepository): Response
    {
        $card = $cardRepository->find($id);
        if(!$card) {
            $request->getSession()->set('errors', ['message' => 'Comment not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $this->denyAccessUnlessGranted('BOARD_READ', $card->getCategory()->getBoard());
        $cardRepository->remove($card, true);
        return $this->redirect($request->headers->get('referer'));
    }
}
