<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220824224527 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE card_label (card_id INT NOT NULL, label_id INT NOT NULL, INDEX IDX_3693A12E4ACC9A20 (card_id), INDEX IDX_3693A12E33B92F39 (label_id), PRIMARY KEY(card_id, label_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card_label ADD CONSTRAINT FK_3693A12E4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_label ADD CONSTRAINT FK_3693A12E33B92F39 FOREIGN KEY (label_id) REFERENCES label (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE label_card');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE label_card (label_id INT NOT NULL, card_id INT NOT NULL, INDEX IDX_DA2C0D1F33B92F39 (label_id), INDEX IDX_DA2C0D1F4ACC9A20 (card_id), PRIMARY KEY(label_id, card_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE label_card ADD CONSTRAINT FK_DA2C0D1F33B92F39 FOREIGN KEY (label_id) REFERENCES label (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE label_card ADD CONSTRAINT FK_DA2C0D1F4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE card_label');
    }
}
