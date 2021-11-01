using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class OrderDetailsEdit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PaymentType",
                table: "Orders",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "BuyerName",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardFamily",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardLastFourDigit",
                table: "Orders",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyerName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CardFamily",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CardLastFourDigit",
                table: "Orders");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentType",
                table: "Orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
