<?php

namespace App\Controller;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use App\Services\ErrorGenerator;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/category')]
class CategoryController extends AbstractController
{
    #[Route('/create', name: 'app_category_new', methods: ['POST'])]
    public function new(Request $request, ErrorGenerator $eg, CategoryRepository $categoryRepository, Security $security, ValidatorInterface $validator, InertiaInterface $inertia): Response
    {
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);
        $data = json_decode($request->getContent(), true);
        $form->submit($data);

        $errors = $validator->validate($category);

        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
        }
        else if($form->isValid()) {
            $c = $categoryRepository->createQueryBuilder('c')
                ->select('c.orderNumber')
                ->where('c.board = :board_id')
                ->setParameter('board_id', $data['board'])
                ->orderBy('c.createdAt', 'DESC')
                ->getQuery()->execute();
            $category->setOrderNumber(count($c) > 0 ? ++$c[0]['orderNumber']: 1);
            $categoryRepository->add($category, true);
        }

        return $this->redirectToRoute('app_board_get', [
            'id' => $data['board']
        ]);
    }

    #[Route('/{id}', name: 'app_category_edit', methods: ['PATCH'])]
    public function edit(int $id, Request $request, ErrorGenerator $eg, CategoryRepository $categoryRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        /** @var Category $category */
        $category = $categoryRepository->find($id);
        if(!$category) {
            $request->getSession()->set('errors', ['message' => 'Category not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);
        $form->submit($data);

        $errors = $validator->validate($category);
        if (count($errors) > 0) {
            $request->getSession()->set('errors', $eg->fromValidation($errors));
            return $this->redirectToRoute('app_dashboard');
        }
        else if ($form->isValid()) {
            $categoryRepository->add($category, true);
        }

        return $this->redirectToRoute('app_board_get', [
            'id' => $data['board']
        ]);
    }

    #[Route('/{id}', name: 'app_category_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request, Category $category, CategoryRepository $categoryRepository): Response
    {
        $category = $categoryRepository->find($id);
        if(!$category) {
            $request->getSession()->set('errors', ['message' => 'Category not found!']);
            return $this->redirect($request->headers->get('referer'));
        }
        $categoryRepository->remove($category, true);
        return $this->redirect($request->headers->get('referer'));
    }
}
