using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class CardAssociation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardAssociation",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardAssociation",
                table: "Orders");
        }
    }
}
