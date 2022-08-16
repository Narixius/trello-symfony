<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use App\Security\SecurityAuthenticator;
use App\Services\ErrorGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(InertiaInterface $inertia, Request $request, SecurityAuthenticator $authenticator): Response
    {
        $user = $this->getUser();
        if($user){
            return $this->redirectToRoute('app_dashboard');
        }

        return $inertia->render('Login');
    }

    #[Route(path: '/register', name: 'app_register')]
    public function register(ValidatorInterface $validator,
                             ErrorGenerator $eg,
                             Request $request,
                             UserRepository $userRepository,
                             InertiaInterface $inertia,
                             UserPasswordHasherInterface $passwordHasher,
                             UserAuthenticatorInterface $authenticator,
                             SecurityAuthenticator $formAuthenticator): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);
        if ($request->isMethod('POST')) {
            $payload = json_decode($request->getContent(), true);
            $form->submit($payload);
            $errors = $validator->validate($user);
            if (count($errors) > 0) {

                return $inertia->render('Register', ['errors'=>$eg->fromValidation($errors)]);
            }
            if ($form->isSubmitted() && $form->isValid()) {
                $user->setPassword($passwordHasher->hashPassword(
                    $user,
                    $payload['password']
                ));
                $userRepository->add($user, true);
                return $authenticator->authenticateUser($user, $formAuthenticator, $request);
            }
        }

        return $inertia->render('Register');
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
