<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220823180628 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D39777D11E');
        $this->addSql('DROP INDEX IDX_161498D39777D11E ON card');
        $this->addSql('ALTER TABLE card ADD order_number INT NOT NULL, CHANGE category_id_id category_id INT NOT NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D312469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_161498D312469DE2 ON card (category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D312469DE2');
        $this->addSql('DROP INDEX IDX_161498D312469DE2 ON card');
        $this->addSql('ALTER TABLE card ADD category_id_id INT NOT NULL, DROP category_id, DROP order_number');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D39777D11E FOREIGN KEY (category_id_id) REFERENCES category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_161498D39777D11E ON card (category_id_id)');
    }
}
