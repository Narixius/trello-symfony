<?php

namespace App\Controller;

use App\Entity\Label;
use App\Form\LabelType;
use App\Repository\CardRepository;
use App\Repository\LabelRepository;
use App\Services\ErrorGenerator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/label')]
#[IsGranted("ROLE_USER", statusCode: 404)]
class LabelController extends AbstractController
{
    #[Route('/create', name: 'app_label_create')]
    public function new(Request $request, ErrorGenerator $eg,CardRepository $cardRepository, LabelRepository $labelRepository, Security $security, ValidatorInterface $validator): Response
    {
        $label = new Label();
        $form = $this->createForm(LabelType::class, $label);
        $form->handleRequest($request);
        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        $errors = $validator->validate($label);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
        }
        else {
            $this->denyAccessUnlessGranted('BOARD_READ', $label->getBoard());
            $label->addCard($cardRepository->find($data['card']));
            $labelRepository->add($label, true);
        }
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/{id}', name: 'app_label_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request, LabelRepository $labelRepository): Response
    {
        $label = $labelRepository->find($id);
        if(!$label) {
            $request->getSession()->set('errors', ['message' => 'Label not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $this->denyAccessUnlessGranted('BOARD_READ', $label->getBoard());
        $labelRepository->remove($label, true);
        return $this->redirect($request->headers->get('referer'));
    }
}
