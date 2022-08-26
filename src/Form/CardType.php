<?php

namespace App\Form;

use App\Entity\Card;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CardType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', options: [
                'required' => false
            ])
            ->add('category', options: [
                'required' => false
            ])
            ->add('description', options: [
                'required' => false,
                'empty_data' => ''
            ])
            ->add('dueDate', DateTimeType::class, options: [
                'required' => false,
                'widget' => 'single_text',
                'html5' => false
            ])
            ->add('assignees', options: [
                'required' => false
            ])
            ->add('labels', options: [
                'required' => false
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Card::class,
        ]);
    }
}
