using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class OrderPaidPrice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaidPrice",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaidPrice",
                table: "Orders");
        }
    }
}
