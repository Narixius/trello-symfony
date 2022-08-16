<?php

namespace App\Services;

use Symfony\Component\Validator\ConstraintViolationListInterface;

class ErrorGenerator {
    public function fromValidation(ConstraintViolationListInterface $errors){
        $newErrors = [];
        for($i = 0; $i < $errors->count(); $i++){
            $newErrors[$errors->get($i)->getPropertyPath()] = $errors->get($i)->getMessage();
        }
        return $newErrors;
    }
}