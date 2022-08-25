<?php

namespace App\Controller;

use App\Entity\Board;
use App\Entity\Card;
use App\Entity\Category;
use App\Entity\User;
use App\Form\BoardType;
use App\Repository\BoardRepository;
use App\Repository\UserRepository;
use App\Services\ErrorGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/board')]
#[IsGranted("ROLE_USER")]
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

    #[Route('/{id}/', name: 'app_board_get', methods: ['GET'])]
    #[IsGranted('BOARD_READ', subject: 'board')]
    public function getBoard(Request $request, InertiaInterface $inertia, Board $board, Security $security) {
        $errors = $request->getSession()->get('errors');
        if(!$board)
            return $inertia->render('Board', [
                'error' => [
                    'message' => 'Board not found'
                ]
            ]);
        return $inertia->render('Board', [
            'board' => $board,
            'user' => $security->getUser(),
            'error' => null,
            'errors' => $errors
        ]);
    }

    #[Route('/{id}/reorder', name: 'app_category_reorder', methods: ['PATCH'])]
    #[IsGranted('BOARD_READ', subject: 'board')]
    public function reorder(Request $request,Board $board, EntityManagerInterface $em) {
        $data = json_decode($request->getContent(), true);

        $categoryRepository = $em->getRepository(Category::class);
        $cardRepository = $em->getRepository(Card::class);

        // $data = ["39-1", "23-2", "33-3"]
        // each data contains {categoryId}-{order}
        if(sizeof($data) > 0 ){
            foreach($data["cards"] as $cardReorder){
                $cardReorder = explode("-", $cardReorder);
                $id = $cardReorder[0];
                $categoryId = $cardReorder[1];
                $orderNumber = $cardReorder[2];
                $cardRepository->find($id)->setOrderNumber($orderNumber)->setCategory($categoryRepository->find($categoryId));
            }
            foreach($data["categories"] as $catReorder){
                $catReorder = explode("-", $catReorder);
                $id = $catReorder[0];
                $orderNumber = $catReorder[1];
                $categoryRepository->find($id)->setOrderNumber($orderNumber);
            }
        }
        $em->flush();
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}/', name: 'app_board_edit', methods: ['PATCH'])]
    #[IsGranted('BOARD_READ', subject: 'board')]
    public function edit(int $id, Request $request, ErrorGenerator $eg, Board $board, BoardRepository $boardRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        /** @var Board $board */
        $board = $boardRepository->find($id);
        if(!$board) {
            $request->getSession()->set('errors', ['message' => 'Board not found!']);
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

    #[Route('/{id}/', name: 'app_board_delete', methods: ['DELETE'])]
    #[IsGranted('BOARD_MANAGE', subject: 'board')]
    public function delete(Request $request, Board $board, BoardRepository $boardRepository): Response
    {
        $boardRepository->remove($board, true);
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}/members', name: 'app_card_add_member', methods: ['POST'])]
    #[IsGranted('BOARD_MANAGE', subject: 'board')]
    public function addMember(int $id, Board $board,Security $security, Request $request,UserRepository $userRepository, ErrorGenerator $eg, BoardRepository $boardRepository, ValidatorInterface $validator): Response
    {
        /** @var User $user */
        $user = $security->getUser();

        $data = json_decode($request->getContent(), true);
        /** @var Board $board */
        $board = $boardRepository->find($id);
        if(!$board) {
            $request->getSession()->set('errors', ['message' => 'Board not found!']);
            return $this->redirect($request->headers->get('referer'));
        }

        if($board->getCreatedBy()->getId() !== $user->getId()){
            $request->getSession()->set('errors', ['message' => 'You do not have permission!']);
            return $this->redirect($request->headers->get('referer'));
        }


        if(!isset($data['email'])){
            $request->getSession()->set('errors', ['email' => 'Email is not provided!']);
            return $this->redirect($request->headers->get('referer'));
        }

        $users = $userRepository->findBy([
            'email' => $data['email']
        ]);

        if(sizeof($users) == 0){
            $request->getSession()->set('errors', ['email' => 'User is not joined with this email!']);
            return $this->redirect($request->headers->get('referer'));
        }

        if($board->getMembers()->contains($users[0])){
            $request->getSession()->set('errors', ['email' => 'This user has been added before']);
            return $this->redirect($request->headers->get('referer'));
        }

        $board->addMember($users[0]);
        $boardRepository->add($board, true);
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}/members', name: 'app_card_delete_member', methods: ['DELETE'])]
    #[IsGranted('BOARD_MANAGE', subject: 'board')]
    public function deleteMember(int $id,Board $board, Security $security, Request $request,UserRepository $userRepository, ErrorGenerator $eg, BoardRepository $boardRepository, ValidatorInterface $validator): Response
    {
        /** @var User $user */
        $user = $security->getUser();

        $data = json_decode($request->getContent(), true);
        /** @var Board $board */
        $board = $boardRepository->find($id);
        if(!$board) {
            $request->getSession()->set('errors', ['message' => 'Board not found!']);
            return $this->redirect($request->headers->get('referer'));
        }

        if($board->getCreatedBy()->getId() !== $user->getId()){
            $request->getSession()->set('errors', ['message' => 'You do not have permission!']);
            return $this->redirect($request->headers->get('referer'));
        }

        if(!isset($data['user'])){
            $request->getSession()->set('errors', ['message' => 'User is not provided!']);
            return $this->redirect($request->headers->get('referer'));
        }

        $deletingUser = $userRepository->find($data['user']);
        if(!$deletingUser){
            $request->getSession()->set('errors', ['message' => 'User not found!']);
            return $this->redirect($request->headers->get('referer'));
        }

        if($board->getMembers()->contains($deletingUser)){
            $board->removeMember($deletingUser);
            $boardRepository->add($board, true);
        }else{
            $request->getSession()->set('errors', ['message' => 'invalid request']);
        }
        return $this->redirect($request->headers->get('referer'));
    }

}
