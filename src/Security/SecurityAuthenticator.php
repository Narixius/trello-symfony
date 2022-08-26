<?php

namespace App\Security;

use Gedmo\Translator\TranslationInterface;
use Rompetomp\InertiaBundle\RompetompInertiaBundle;
use Rompetomp\InertiaBundle\Service\Inertia;
use Rompetomp\InertiaBundle\Service\InertiaInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;

class SecurityAuthenticator extends AbstractLoginFormAuthenticator implements AuthenticationFailureHandlerInterface
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = 'app_login';
    private UrlGeneratorInterface $urlGenerator;
    private InertiaInterface $inertia;
    private TranslatorInterface $translation;

    public function __construct(UrlGeneratorInterface $urlGenerator, InertiaInterface $inertia, TranslatorInterface $translation)
    {
        $this->inertia = $inertia;
        $this->urlGenerator = $urlGenerator;
        $this->translation = $translation;
    }

    public function authenticate(Request $request): Passport
    {
        $email = $request->request->get('email', '');

        $request->getSession()->set(Security::LAST_USERNAME, $email);

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($request->request->get('password', '')),
            [
                new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token')),
            ]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        if ($targetPath = $this->getTargetPath($request->getSession(), $firewallName)) {
            return new RedirectResponse($targetPath);
        }

        return new RedirectResponse($this->urlGenerator->generate('app_dashboard'));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        return $this->inertia->render("Login", [
            'error' => $this->translation->trans($exception->getMessage()),
            'messages' =>  Yaml::parseFile(__DIR__.'/../../translations/messages.'.$this->translation->getLocale().".yaml"),
            'locale' => $this->translation->getLocale()
        ]);
    }

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }
}
