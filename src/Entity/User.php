<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity('email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private $email;

    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'string')]
    #[Assert\NotBlank]
    private $password;

    #[ORM\ManyToMany(targetEntity: Card::class, mappedBy: 'assignees')]
    private $cards;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    private $firstName;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $lastName;

    #[ORM\ManyToMany(targetEntity: Board::class, mappedBy: 'members', fetch: 'EXTRA_LAZY')]
    private $boards;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable(on: 'create')]
    private $createdAt;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Gedmo\Timestampable]
    private $updatedAt;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Board::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
    #[Ignore()]
    private $createdBoards;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Card::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
    #[Ignore()]
    private $createdCards;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Category::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
    #[Ignore()]
    private $createdCategories;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Comment::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
    #[Ignore()]
    private $createdComments;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Label::class, fetch: 'EXTRA_LAZY', orphanRemoval: true)]
    #[Ignore()]
    private $createdLabels;

    public function __construct()
    {
        $this->cards = new ArrayCollection();
        $this->boards = new ArrayCollection();
        $this->createdBoards = new ArrayCollection();
        $this->createdCards = new ArrayCollection();
        $this->createdCategories = new ArrayCollection();
        $this->createdComments = new ArrayCollection();
        $this->createdLabels = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Card>
     */
    public function getCards(): Collection
    {
        return $this->cards;
    }

    public function addCard(Card $card): self
    {
        if (!$this->cards->contains($card)) {
            $this->cards[] = $card;
            $card->addAssignee($this);
        }

        return $this;
    }

    public function removeCard(Card $card): self
    {
        if ($this->cards->removeElement($card)) {
            $card->removeAssignee($this);
        }

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return Collection<int, Board>
     */
    public function getBoards(): Collection
    {
        return $this->boards;
    }

    public function addBoard(Board $board): self
    {
        if (!$this->boards->contains($board)) {
            $this->boards[] = $board;
            $board->addMember($this);
        }

        return $this;
    }

    public function removeBoard(Board $board): self
    {
        if ($this->boards->removeElement($board)) {
            $board->removeMember($this);
        }

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, Board>
     */
    public function getCreatedBoards(): Collection
    {
        return $this->createdBoards;
    }

    public function addCreatedBoard(Board $selfBoard): self
    {
        if (!$this->createdBoards->contains($selfBoard)) {
            $this->createdBoards[] = $selfBoard;
            $selfBoard->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedBoard(Board $selfBoard): self
    {
        if ($this->createdBoards->removeElement($selfBoard)) {
            // set the owning side to null (unless already changed)
            if ($selfBoard->getCreatedBy() === $this) {
                $selfBoard->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Card>
     */
    public function getCreatedCards(): Collection
    {
        return $this->createdCards;
    }

    public function addCreatedCard(Card $selfCard): self
    {
        if (!$this->createdCards->contains($selfCard)) {
            $this->createdCards[] = $selfCard;
            $selfCard->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedCard(Card $selfCard): self
    {
        if ($this->createdCards->removeElement($selfCard)) {
            // set the owning side to null (unless already changed)
            if ($selfCard->getCreatedBy() === $this) {
                $selfCard->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCreatedCategories(): Collection
    {
        return $this->createdCategories;
    }

    public function addCreatedCategory(Category $createdCategory): self
    {
        if (!$this->createdCategories->contains($createdCategory)) {
            $this->createdCategories[] = $createdCategory;
            $createdCategory->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedCategory(Category $createdCategory): self
    {
        if ($this->createdCategories->removeElement($createdCategory)) {
            // set the owning side to null (unless already changed)
            if ($createdCategory->getCreatedBy() === $this) {
                $createdCategory->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getCreatedComments(): Collection
    {
        return $this->createdComments;
    }

    public function addCreatedComment(Comment $createdComment): self
    {
        if (!$this->createdComments->contains($createdComment)) {
            $this->createdComments[] = $createdComment;
            $createdComment->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedComment(Comment $createdComment): self
    {
        if ($this->createdComments->removeElement($createdComment)) {
            // set the owning side to null (unless already changed)
            if ($createdComment->getCreatedBy() === $this) {
                $createdComment->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Label>
     */
    public function getCreatedLabels(): Collection
    {
        return $this->createdLabels;
    }

    public function addCreatedLabel(Label $createdLabel): self
    {
        if (!$this->createdLabels->contains($createdLabel)) {
            $this->createdLabels[] = $createdLabel;
            $createdLabel->setCreatedBy($this);
        }

        return $this;
    }

    public function removeCreatedLabel(Label $createdLabel): self
    {
        if ($this->createdLabels->removeElement($createdLabel)) {
            // set the owning side to null (unless already changed)
            if ($createdLabel->getCreatedBy() === $this) {
                $createdLabel->setCreatedBy(null);
            }
        }

        return $this;
    }
}
