<?php

namespace App\Controller;

use App\Entity\Card;
use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use App\Services\ErrorGenerator;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/reorder', name: 'app_category_reorder', methods: ['PATCH'])]
    public function reorder(Request $request, EntityManagerInterface $em) {
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
