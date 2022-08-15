<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220814211926 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE board (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, color VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card (id INT AUTO_INCREMENT NOT NULL, list_id_id INT NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, due_date DATETIME DEFAULT NULL, INDEX IDX_161498D3A6D70A54 (list_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_user (card_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_61A0D4EB4ACC9A20 (card_id), INDEX IDX_61A0D4EBA76ED395 (user_id), PRIMARY KEY(card_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, board_id_id INT NOT NULL, title VARCHAR(255) NOT NULL, INDEX IDX_64C19C1DDF9797C (board_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, card_id_id INT DEFAULT NULL, text VARCHAR(255) NOT NULL, INDEX IDX_9474526C47706F91 (card_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE label (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, color VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE label_card (label_id INT NOT NULL, card_id INT NOT NULL, INDEX IDX_DA2C0D1F33B92F39 (label_id), INDEX IDX_DA2C0D1F4ACC9A20 (card_id), PRIMARY KEY(label_id, card_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3A6D70A54 FOREIGN KEY (list_id_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE card_user ADD CONSTRAINT FK_61A0D4EB4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_user ADD CONSTRAINT FK_61A0D4EBA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1DDF9797C FOREIGN KEY (board_id_id) REFERENCES board (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C47706F91 FOREIGN KEY (card_id_id) REFERENCES card (id)');
        $this->addSql('ALTER TABLE label_card ADD CONSTRAINT FK_DA2C0D1F33B92F39 FOREIGN KEY (label_id) REFERENCES label (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE label_card ADD CONSTRAINT FK_DA2C0D1F4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1DDF9797C');
        $this->addSql('ALTER TABLE card_user DROP FOREIGN KEY FK_61A0D4EB4ACC9A20');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C47706F91');
        $this->addSql('ALTER TABLE label_card DROP FOREIGN KEY FK_DA2C0D1F4ACC9A20');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3A6D70A54');
        $this->addSql('ALTER TABLE label_card DROP FOREIGN KEY FK_DA2C0D1F33B92F39');
        $this->addSql('ALTER TABLE card_user DROP FOREIGN KEY FK_61A0D4EBA76ED395');
        $this->addSql('DROP TABLE board');
        $this->addSql('DROP TABLE card');
        $this->addSql('DROP TABLE card_user');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE label');
        $this->addSql('DROP TABLE label_card');
        $this->addSql('DROP TABLE user');
    }
}
