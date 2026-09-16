USE [master]
GO
/****** Object:  Database [PadelDBCuassolo]    Script Date: 16/09/2026 ******/
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'PadelDBCuassolo')
BEGIN
    CREATE DATABASE [PadelDBCuassolo]
END
GO

USE [PadelDBCuassolo]
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'prog2')
BEGIN
    IF EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'prog2')
    BEGIN
        CREATE USER [prog2] FOR LOGIN [prog2] WITH DEFAULT_SCHEMA=[dbo];
        ALTER ROLE [db_owner] ADD MEMBER [prog2];
    END
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Canchas]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Canchas](
        [IdCancha] [int] IDENTITY(1,1) NOT NULL,
        [Nombre] [nvarchar](100) NOT NULL,
        [PrecioPorHora] [decimal](10, 2) NOT NULL,
        CONSTRAINT [PK_Canchas] PRIMARY KEY CLUSTERED ([IdCancha] ASC),
        CONSTRAINT [UQ_Canchas_Nombre] UNIQUE ([Nombre]),
        CONSTRAINT [CK_Canchas_Precio] CHECK ([PrecioPorHora] > 0)
    ) ON [PRIMARY];
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reservas]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Reservas](
        [IdReserva] [int] IDENTITY(1,1) NOT NULL,
        [IdCancha] [int] NOT NULL,
        [Cliente] [nvarchar](100) NOT NULL,
        [Fecha] [date] NOT NULL,
        [Hora] [nvarchar](5) NOT NULL,
        [Pagada] [bit] NOT NULL CONSTRAINT [DF_Reservas_Pagada] DEFAULT (0),
        CONSTRAINT [PK_Reservas] PRIMARY KEY CLUSTERED ([IdReserva] ASC),
        CONSTRAINT [FK_Reservas_Canchas] FOREIGN KEY([IdCancha]) REFERENCES [dbo].[Canchas] ([IdCancha]),
        CONSTRAINT [UQ_Cancha_Fecha_Hora] UNIQUE ([IdCancha], [Fecha], [Hora])
    ) ON [PRIMARY];
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Canchas)
BEGIN
    SET IDENTITY_INSERT [dbo].[Canchas] ON;
    INSERT [dbo].[Canchas] ([IdCancha], [Nombre], [PrecioPorHora]) VALUES (1, N'Cancha 1 - Cristal', CAST(30000.00 AS Decimal(10, 2)));
    INSERT [dbo].[Canchas] ([IdCancha], [Nombre], [PrecioPorHora]) VALUES (2, N'Cancha 2 - Reja', CAST(40000.00 AS Decimal(10, 2)));
    INSERT [dbo].[Canchas] ([IdCancha], [Nombre], [PrecioPorHora]) VALUES (7, N'Cancha 3 - Pared', CAST(20000.00 AS Decimal(10, 2)));
    SET IDENTITY_INSERT [dbo].[Canchas] OFF;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Reservas)
BEGIN
    SET IDENTITY_INSERT [dbo].[Reservas] ON;
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (2, 1, N'Martín López', CAST(N'2026-09-16' AS Date), N'18:00', 1);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (4, 1, N'Carolina Gómez', CAST(N'2026-09-16' AS Date), N'19:00', 0);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (5, 1, N'Federico Ruiz', CAST(N'2026-09-16' AS Date), N'20:00', 1);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (6, 2, N'Luciana Fernández', CAST(N'2026-09-16' AS Date), N'18:00', 0);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (7, 2, N'Gonzalo Pérez', CAST(N'2026-09-17' AS Date), N'17:00', 1);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (10, 7, N'Sofía Martínez', CAST(N'2026-09-17' AS Date), N'20:00', 0);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (11, 7, N'Diego Sánchez', CAST(N'2026-09-18' AS Date), N'16:00', 1);
    INSERT [dbo].[Reservas] ([IdReserva], [IdCancha], [Cliente], [Fecha], [Hora], [Pagada]) VALUES (12, 1, N'Valentina Castro', CAST(N'2026-09-18' AS Date), N'18:00', 0);
    SET IDENTITY_INSERT [dbo].[Reservas] OFF;
END
GO


CREATE OR ALTER PROCEDURE [dbo].[usp_ListarCanchas]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdCancha      AS idCancha,
        Nombre        AS nombre,
        PrecioPorHora AS precioPorHora
    FROM dbo.Canchas
    ORDER BY Nombre;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[usp_ListarReservas]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.IdReserva     AS idReserva,
        R.IdCancha      AS idCancha,
        C.Nombre        AS cancha,
        C.PrecioPorHora AS precioPorHora,
        R.Cliente       AS cliente,
        R.Fecha         AS fecha,
        R.Hora          AS hora,
        R.Pagada        AS pagada
    FROM dbo.Reservas AS R
    INNER JOIN dbo.Canchas AS C ON C.IdCancha = R.IdCancha
    ORDER BY R.Fecha ASC, R.Hora ASC;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[usp_CrearReserva]
    @IdCancha INT,
    @Cliente  NVARCHAR(100),
    @Fecha    DATE,
    @Hora     NVARCHAR(5)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Cliente IS NULL OR LTRIM(RTRIM(@Cliente)) = N''
        THROW 50003, 'Debe indicar el nombre del cliente.', 1;

    IF NOT EXISTS (SELECT 1 FROM dbo.Canchas WHERE IdCancha = @IdCancha)
        THROW 50002, 'La cancha indicada no existe.', 1;

    IF EXISTS (
        SELECT 1 
        FROM dbo.Reservas 
        WHERE IdCancha = @IdCancha 
          AND Fecha = @Fecha 
          AND Hora = @Hora
    )
        THROW 50011, 'La cancha ya se encuentra reservada en la fecha y hora seleccionadas.', 1;

    INSERT INTO dbo.Reservas (IdCancha, Cliente, Fecha, Hora, Pagada)
    VALUES (@IdCancha, LTRIM(RTRIM(@Cliente)), @Fecha, @Hora, 0);

    SELECT SCOPE_IDENTITY() AS idReserva;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[usp_RegistrarPago]
    @IdReserva INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Pagada BIT;

    SELECT @Pagada = Pagada
    FROM dbo.Reservas
    WHERE IdReserva = @IdReserva;

    IF @Pagada IS NULL
        THROW 50002, 'La reserva indicada no existe.', 1;

    IF @Pagada = 1
        THROW 50008, 'La reserva ya se encuentra pagada.', 1;

    UPDATE dbo.Reservas
    SET Pagada = 1
    WHERE IdReserva = @IdReserva;

    SELECT @IdReserva AS idReserva;
END;
GO

-- 10) usp_RecaudacionPorCancha (6 pts)
CREATE OR ALTER PROCEDURE [dbo].[usp_RecaudacionPorCancha]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        C.IdCancha                                                             AS idCancha,
        C.Nombre                                                               AS cancha,
        COUNT(R.IdReserva)                                                     AS cantidadReservas,
        ISNULL(SUM(CASE WHEN R.Pagada = 1 THEN C.PrecioPorHora ELSE 0 END), 0) AS totalCobrado,
        ISNULL(SUM(CASE WHEN R.Pagada = 0 THEN C.PrecioPorHora ELSE 0 END), 0) AS totalPendiente
    FROM dbo.Canchas AS C
    LEFT JOIN dbo.Reservas AS R ON R.IdCancha = C.IdCancha
    GROUP BY C.IdCancha, C.Nombre
    ORDER BY C.Nombre;
END;
GO
