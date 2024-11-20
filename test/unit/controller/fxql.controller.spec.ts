import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { FxqlController } from '../../../src/modules/fxql/controller/fxql.controller';
import { GlobalResponseHandler } from '../../../src/modules/common/response-handler';
import { FXQLStatementDto } from '../../../src/modules/fxql/dto/fxql.dto';
import { FxqlService } from '../../../src/modules/fxql/service/fxql.service';

describe('FxqlController', () => {
  let controller: FxqlController;
  let fxqlService: FxqlService;
  let mockResponseHandler: GlobalResponseHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxqlController],
      providers: [
        {
          provide: FxqlService,
          useValue: {
            processFxql: jest.fn(),
          },
        },
        {
          provide: GlobalResponseHandler,
          useValue: {
            handleControllerResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FxqlController>(FxqlController);
    fxqlService = module.get<FxqlService>(FxqlService);
    mockResponseHandler = module.get<GlobalResponseHandler>(GlobalResponseHandler);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processFxql', () => {
    it('should process FXQL statements', async () => {
      const mockFxqlDto: FXQLStatementDto[] = [
        { currencyPair: 'USD-GBP', buy: 0.85, sell: 0.9, cap: 10000 },
      ];

      const mockResponse = { code: 'FXQL-200', message: 'Rates Parsed Successfully', data: [] };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(fxqlService, 'processFxql').mockResolvedValue(mockResponse);
      jest.spyOn(mockResponseHandler, 'handleControllerResponse');

      await controller.processFxql(mockFxqlDto, res);

      expect(fxqlService.processFxql).toHaveBeenCalledWith(mockFxqlDto);
      expect(mockResponseHandler.handleControllerResponse).toHaveBeenCalledWith(
        res,
        mockResponse,
      );
    });
  });
});
