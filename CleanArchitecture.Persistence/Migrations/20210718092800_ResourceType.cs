using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class ResourceType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResourceType",
                table: "Certificates",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResourceType",
                table: "Certificates");
        }
    }
}
