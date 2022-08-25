<?php

namespace App\Security\Voter;

use App\Entity\Board;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class BoardAccessVoter extends Voter
{
    public const MANAGE = 'BOARD_MANAGE';
    public const READ = 'BOARD_READ';

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [self::MANAGE, self::READ]) && $subject instanceof Board;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        /** @var User $user */
        $user = $token->getUser();
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Board $subject */
        if($subject){
            if($subject->getCreatedBy()->getId() === $user->getId()){
                return true;
            }
        }

        switch ($attribute) {
            case self::MANAGE:
                /** @var Board $subject */
                if($subject->getCreatedBy()->getId() === $user->getId())
                    return true;
                break;
            case self::READ:
                /** @var Board $subject */
                if($subject->getMembers()->contains($user))
                    return true;
                break;
        }

        return false;
    }
}
