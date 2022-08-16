<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220816112654 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE board_id (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE board ADD updated_by_id INT DEFAULT NULL, ADD created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE board ADD CONSTRAINT FK_58562B47896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE board ADD CONSTRAINT FK_58562B47B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_58562B47896DBBDE ON board (updated_by_id)');
        $this->addSql('CREATE INDEX IDX_58562B47B03A8386 ON board (created_by_id)');
        $this->addSql('ALTER TABLE card ADD created_by_id INT NOT NULL, ADD updated_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_161498D3B03A8386 ON card (created_by_id)');
        $this->addSql('CREATE INDEX IDX_161498D3896DBBDE ON card (updated_by_id)');
        $this->addSql('ALTER TABLE category ADD created_by_id INT NOT NULL, ADD updated_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_64C19C1B03A8386 ON category (created_by_id)');
        $this->addSql('CREATE INDEX IDX_64C19C1896DBBDE ON category (updated_by_id)');
        $this->addSql('ALTER TABLE comment ADD created_by_id INT NOT NULL, ADD updated_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CB03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_9474526CB03A8386 ON comment (created_by_id)');
        $this->addSql('CREATE INDEX IDX_9474526C896DBBDE ON comment (updated_by_id)');
        $this->addSql('ALTER TABLE label ADD board_id_id INT NOT NULL, ADD created_by_id INT NOT NULL, ADD updated_by_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8DDF9797C FOREIGN KEY (board_id_id) REFERENCES board (id)');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8896DBBDE FOREIGN KEY (updated_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_EA750E8DDF9797C ON label (board_id_id)');
        $this->addSql('CREATE INDEX IDX_EA750E8B03A8386 ON label (created_by_id)');
        $this->addSql('CREATE INDEX IDX_EA750E8896DBBDE ON label (updated_by_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE board_id');
        $this->addSql('ALTER TABLE board DROP FOREIGN KEY FK_58562B47896DBBDE');
        $this->addSql('ALTER TABLE board DROP FOREIGN KEY FK_58562B47B03A8386');
        $this->addSql('DROP INDEX IDX_58562B47896DBBDE ON board');
        $this->addSql('DROP INDEX IDX_58562B47B03A8386 ON board');
        $this->addSql('ALTER TABLE board DROP updated_by_id, DROP created_by_id');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3B03A8386');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3896DBBDE');
        $this->addSql('DROP INDEX IDX_161498D3B03A8386 ON card');
        $this->addSql('DROP INDEX IDX_161498D3896DBBDE ON card');
        $this->addSql('ALTER TABLE card DROP created_by_id, DROP updated_by_id');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1B03A8386');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1896DBBDE');
        $this->addSql('DROP INDEX IDX_64C19C1B03A8386 ON category');
        $this->addSql('DROP INDEX IDX_64C19C1896DBBDE ON category');
        $this->addSql('ALTER TABLE category DROP created_by_id, DROP updated_by_id');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CB03A8386');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C896DBBDE');
        $this->addSql('DROP INDEX IDX_9474526CB03A8386 ON comment');
        $this->addSql('DROP INDEX IDX_9474526C896DBBDE ON comment');
        $this->addSql('ALTER TABLE comment DROP created_by_id, DROP updated_by_id');
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8DDF9797C');
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8B03A8386');
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8896DBBDE');
        $this->addSql('DROP INDEX IDX_EA750E8DDF9797C ON label');
        $this->addSql('DROP INDEX IDX_EA750E8B03A8386 ON label');
        $this->addSql('DROP INDEX IDX_EA750E8896DBBDE ON label');
        $this->addSql('ALTER TABLE label DROP board_id_id, DROP created_by_id, DROP updated_by_id');
    }
}
