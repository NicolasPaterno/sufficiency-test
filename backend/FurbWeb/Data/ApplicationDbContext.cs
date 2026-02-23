using Microsoft.EntityFrameworkCore;
using FurbWeb.Models;

namespace FurbWeb.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Comanda> Comandas { get; set; }
    public DbSet<ComandaProduto> ComandaProdutos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Cliente>().ToTable("Clientes");
        modelBuilder.Entity<Produto>().ToTable("Produtos");
        modelBuilder.Entity<Comanda>().ToTable("Comandas");
        modelBuilder.Entity<ComandaProduto>().ToTable("ComandaProdutos");

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Login)
            .IsUnique();

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Cliente>()
            .Property(c => c.IdCliente)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Produto>()
            .Property(p => p.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Comanda>()
            .Property(c => c.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<ComandaProduto>()
            .Property(cp => cp.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Comanda>()
            .HasOne(c => c.Cliente)
            .WithMany(cl => cl.Comandas)
            .HasForeignKey(c => c.IdCliente)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ComandaProduto>()
            .HasOne(cp => cp.Comanda)
            .WithMany(c => c.ComandaProdutos)
            .HasForeignKey(cp => cp.ComandaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ComandaProduto>()
            .HasOne(cp => cp.Produto)
            .WithMany(p => p.ComandaProdutos)
            .HasForeignKey(cp => cp.ProdutoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

