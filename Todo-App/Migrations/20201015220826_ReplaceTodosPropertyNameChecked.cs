using Microsoft.EntityFrameworkCore.Migrations;

namespace Todo_App.Migrations
{
    public partial class ReplaceTodosPropertyNameChecked : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cheked",
                table: "Todo");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Todo",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Todo");

            migrationBuilder.AddColumn<bool>(
                name: "Cheked",
                table: "Todo",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
