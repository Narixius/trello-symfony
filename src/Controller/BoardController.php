<?php

namespace App\Controller;

use App\Entity\Board;
use App\Entity\User;
use App\Form\BoardType;
use App\Form\UserType;
use App\Repository\BoardRepository;
use App\Repository\UserRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/board')]
class BoardController extends AbstractController
{

    #[Route('/create', name: 'app_board_new', methods: ['GET', 'POST'])]
    public function new(Request $request, ErrorGenerator $eg, BoardRepository $boardRepository, Security $security, ValidatorInterface $validator, InertiaInterface $inertia): Response
    {
        $board = new Board();
        $form = $this->createForm(BoardType::class, $board);
        $form->handleRequest($request);
        $form->submit(json_decode($request->getContent(), true));

        $errors = $validator->validate($board);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
            return $this->redirectToRoute('app_dashboard');
        }

        if ($form->isValid()) {
            $board->addMember($security->getUser());
            $boardRepository->add($board, true);
        }

        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/{id}', name: 'app_board_edit', methods: ['PATCH'])]
    public function edit(Request $request, Board $board, ErrorGenerator $eg, BoardRepository $boardRepository, ValidatorInterface $validator): Response
    {
        $form = $this->createForm(BoardType::class, $board);
        $form->handleRequest($request);
        $form->submit(json_decode($request->getContent(), true));

        $errors = $validator->validate($board);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
            return $this->redirectToRoute('app_dashboard');
        }

        if ($form->isValid()) {
            $boardRepository->add($board, true);
        }

        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/{id}', name: 'app_board_delete', methods: ['DELETE'])]
    public function delete(Request $request, Board $board, BoardRepository $boardRepository): Response
    {
        $boardRepository->remove($board, true);
        return $this->redirectToRoute('app_dashboard', [], Response::HTTP_SEE_OTHER);
    }
}
