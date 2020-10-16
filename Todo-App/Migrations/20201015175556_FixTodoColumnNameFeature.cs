using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo_App.Migrations
{
    public partial class FixTodoColumnNameFeature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFetured",
                table: "Todo");

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Todo",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Todo");

            migrationBuilder.AddColumn<bool>(
                name: "IsFetured",
                table: "Todo",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
