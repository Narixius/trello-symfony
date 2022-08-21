<?php

namespace App\Controller;

use App\Entity\Board;
use App\Entity\Category;
use App\Form\BoardType;
use App\Repository\BoardRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/board')]
class BoardController extends AbstractController
{

    #[Route('/create', name: 'app_board_new', methods: ['POST'])]
    public function new(Request $request, ErrorGenerator $eg, BoardRepository $boardRepository, Security $security, ValidatorInterface $validator, InertiaInterface $inertia): Response
    {
        $board = new Board();
        $form = $this->createForm(BoardType::class, $board);
        $form->handleRequest($request);
        $form->submit(json_decode($request->getContent(), true));

        $errors = $validator->validate($board);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
        }
        else if ($form->isValid()) {
            $board->addMember($security->getUser());
            $boardRepository->add($board, true);
        }

        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}', name: 'app_board_get', methods: ['GET'])]
    #[IsGranted("ROLE_USER")]
    public function getBoard(Request $request, InertiaInterface $inertia, Board $board, Security $security) {
        if(!$board)
            return $inertia->render('Board', [
                'error' => [
                    'message' => 'Board not found'
                ]
            ]);
        return $inertia->render('Board', [
            'board' => $board,
            'user' => $security->getUser(),
            'error' => null
        ]);
    }

    #[Route('/{id}', name: 'app_board_edit', methods: ['PATCH'])]
    public function edit(int $id, Request $request, ErrorGenerator $eg, BoardRepository $boardRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        /** @var Board $board */
        $board = $boardRepository->find($id);
        if(!$board) {
            $request->getSession()->set('errors', ['message' => 'Category not found!']);
            return $this->redirect($request->headers->get('referer'));
        }

        $form = $this->createForm(BoardType::class, $board);
        $form->handleRequest($request);
        $form->submit($data);

        $errors = $validator->validate($board);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
            return $this->redirect($request->headers->get('referer'));
        }

        if ($form->isValid()) {
            $boardRepository->add($board, true);
        }

        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}', name: 'app_board_delete', methods: ['DELETE'])]
    public function delete(Request $request, Board $board, BoardRepository $boardRepository): Response
    {
        $boardRepository->remove($board, true);
        return $this->redirect($request->headers->get('referer'));
    }
}
