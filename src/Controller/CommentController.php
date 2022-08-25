<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\User;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/comment')]
#[IsGranted("ROLE_USER")]
class CommentController extends AbstractController
{
    #[Route('/create', name: 'app_comment_new', methods: ['POST'])]
    public function new(Request $request, ErrorGenerator $eg, CommentRepository $commentRepository, Security $security, ValidatorInterface $validator, InertiaInterface $inertia): Response
    {
        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);
        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        $errors = $validator->validate($comment);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
        }
        else if($form->isValid()) {
            $this->denyAccessUnlessGranted('BOARD_READ', $comment->getCard()->getCategory()->getBoard());
            $commentRepository->add($comment, true);
        }
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}', name: 'app_comment_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request, ErrorGenerator $eg, Security $security, Comment $comment, CommentRepository $commentRepository): Response
    {
        /** @var User $user */
        $user = $security->getUser();
        $comment = $commentRepository->find($id);
        if(!$comment) {
            $request->getSession()->set('errors', ['message' => 'Comment not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $this->denyAccessUnlessGranted('BOARD_READ', $comment->getCard()->getCategory()->getBoard());
        if($user->getId() == $comment->getCreatedBy()->getId())
            $commentRepository->remove($comment, true);
        else $request->getSession()->set('errors', ['message' => 'you do not have permission to delete this comment']);
        return $this->redirect($request->headers->get('referer'));
    }
}
