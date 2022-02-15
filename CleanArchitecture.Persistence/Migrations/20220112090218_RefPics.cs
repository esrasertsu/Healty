using Microsoft.EntityFrameworkCore.Migrations;

namespace CleanArchitecture.Persistence.Migrations
{
    public partial class RefPics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ReferencePics",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "OriginalPublicId",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "ThumbnailPublicId",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "OriginalUrl",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "ReferencePics");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "ReferencePics",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "ReferencePics",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReferencePics",
                table: "ReferencePics",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ReferencePics",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ReferencePics");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "ReferencePics");

            migrationBuilder.AddColumn<string>(
                name: "OriginalPublicId",
                table: "ReferencePics",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailPublicId",
                table: "ReferencePics",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "ReferencePics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OriginalUrl",
                table: "ReferencePics",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "ReferencePics",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "ReferencePics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReferencePics",
                table: "ReferencePics",
                columns: new[] { "OriginalPublicId", "ThumbnailPublicId" });
        }
    }
}
