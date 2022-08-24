<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220824011707 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8DDF9797C');
        $this->addSql('DROP INDEX IDX_EA750E8DDF9797C ON label');
        $this->addSql('ALTER TABLE label CHANGE board_id_id board_id INT NOT NULL');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8E7EC5785 FOREIGN KEY (board_id) REFERENCES board (id)');
        $this->addSql('CREATE INDEX IDX_EA750E8E7EC5785 ON label (board_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8E7EC5785');
        $this->addSql('DROP INDEX IDX_EA750E8E7EC5785 ON label');
        $this->addSql('ALTER TABLE label CHANGE board_id board_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8DDF9797C FOREIGN KEY (board_id_id) REFERENCES board (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_EA750E8DDF9797C ON label (board_id_id)');
    }
}
